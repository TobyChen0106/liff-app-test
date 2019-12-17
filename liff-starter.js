window.onload = function (e) {
    liff.init(function (data) {
        initializeApp(data);
    });
};

function initializeApp(data) {
    // document.getElementById('languagefield').textContent = data.language;
    // document.getElementById('viewtypefield').textContent = data.context.viewType;
    // document.getElementById('useridfield').textContent = data.context.userId;
    // document.getElementById('utouidfield').textContent = data.context.utouId;
    // document.getElementById('roomidfield').textContent = data.context.roomId;
    // document.getElementById('groupidfield').textContent = data.context.groupId;

    // openWindow call
    document.getElementById('openwindowbutton').addEventListener('click', function () {
        liff.openWindow({
            url: 'https://line.me'
        });
    });

    // closeWindow call
    document.getElementById('closewindowbutton').addEventListener('click', function () {
        liff.closeWindow();
    });

    // sendMessages call
    document.getElementById('sendmessagebutton').addEventListener('click', function () {
        liff.sendMessages([{
            type: 'text',
            text: "You've successfully sent a message! Hooray!"
        }, {
            type: 'sticker',
            packageId: '2',
            stickerId: '144'
        }]).then(function () {
            window.alert("Message sent");
        }).catch(function (error) {
            window.alert("Error sending message: " + error);
        });
    });

    // get access token
    document.getElementById('getaccesstoken').addEventListener('click', function () {
        const accessToken = liff.getAccessToken();
        document.getElementById('accesstokenfield').textContent = accessToken;
        toggleAccessToken();
    });

    // get profile call
    document.getElementById('getprofilebutton').addEventListener('click', function () {
        liff.getProfile().then(function (profile) {
            document.getElementById('useridprofilefield').textContent = profile.userId;
            document.getElementById('displaynamefield').textContent = profile.displayName;

            const profilePictureDiv = document.getElementById('profilepicturediv');
            if (profilePictureDiv.firstElementChild) {
                profilePictureDiv.removeChild(profilePictureDiv.firstElementChild);
            }
            const img = document.createElement('img');
            img.src = profile.pictureUrl;
            img.alt = "Profile Picture";
            profilePictureDiv.appendChild(img);

            document.getElementById('statusmessagefield').textContent = profile.statusMessage;
            toggleProfileData();
        }).catch(function (error) {
            window.alert("Error getting profile: " + error);
        });
    });
}

function toggleAccessToken() {
    toggleElement('accesstokendata');
}

function toggleProfileData() {
    toggleElement('profileinfo');
}

function toggleElement(elementId) {
    const elem = document.getElementById(elementId);
    if (elem.offsetWidth > 0 && elem.offsetHeight > 0) {
        elem.style.display = "none";
    } else {
        elem.style.display = "block";
    }
}

formOnSubmit = () => {
    if (document.getElementById('agree').checked) {
        liff.closeWindow();
        return true;
    }
    else {
        alert('請閱讀並同意使用者服務條款!');
        return false;
    }
}

// slider
var slider = new Slider(document.getElementById('slider'), 0, 100);
slider.onChange = function (value) {
    document.getElementById('value').textContent = Math.round(value);
};
slider.setValue(25);

function Slider(container, minValue, maxValue) {
    var slider = this;

    ///////////
    //  DOM  //
    ///////////
    var slideGroup = document.createElement('div');
    container.appendChild(slideGroup);
    slideGroup.style.position = 'relative';
    slideGroup.style.width =
        slideGroup.style.height =
        '100%';

    var slideBar = document.createElement('div');
    slideGroup.appendChild(slideBar);
    slideBar.style.position = 'absolute';
    slideBar.style.left =
        slideBar.style.right =
        slideBar.style.top =
        slideBar.style.bottom =
        Math.round(container.offsetHeight / 2 - 1) + 'px';
    slideBar.style.backgroundColor = 'black';

    var slideButton = document.createElement('div');
    slideGroup.appendChild(slideButton);
    slideButton.style.position = 'absolute';
    slideButton.style.width =
        slideButton.style.height =
        slideButton.style.borderRadius =
        container.offsetHeight + 'px';

    /////////////
    //  COLOR  //
    /////////////
    var startColor = { r: 255, g: 0, b: 0 };
    var midColor = { r: 255, g: 255, b: 0 };
    var endColor = { r: 0, g: 255, b: 0 };

    var colorAt = function (position) {
        if (position <= .5) {
            var r = startColor.r * (.5 - position) * 2 + midColor.r * (position - 0) * 2;
            var g = startColor.g * (.5 - position) * 2 + midColor.g * (position - 0) * 2;
            var b = startColor.b * (.5 - position) * 2 + midColor.b * (position - 0) * 2;
        } else {
            var r = midColor.r * (1 - position) * 2 + endColor.r * (position - .5) * 2;
            var g = midColor.g * (1 - position) * 2 + endColor.g * (position - .5) * 2;
            var b = midColor.b * (1 - position) * 2 + endColor.b * (position - .5) * 2;
        }
        return 'rgb(' + Math.ceil(r) + ', ' + Math.ceil(g) + ', ' + Math.ceil(b) + ')';
    };

    /////////////
    //  VALUE  //
    /////////////
    var value = null;

    slider.getValue = function () {
        return value;
    };

    slider.setValue = function (newValue) {
        value = Math.max(minValue, Math.min(maxValue, newValue));
        var position = (value - minValue) / (maxValue - minValue);
        slideButton.style.left = Math.round(position * slideBar.offsetWidth) + 'px';
        slideButton.style.backgroundColor = colorAt(position);
        if (slider.onChange) slider.onChange(value);
    };

    slider.setValue(minValue);

    /////////////
    //  MOUSE  //
    /////////////
    var sliding = false;
    var startX = 0;

    document.addEventListener('touchstart', function (event) {
        var touches = event.touches;
        if (touches.length === 1) {
            if (touches[0].target === slideButton) {
                event.preventDefault();
                sliding = true;
                startX = touches[0].pageX;
            }
        }
    }, false);

    document.addEventListener('touchend', function (event) {
        if (sliding) {
            sliding = false;
            startX = null;
        }
    }, false);

    document.addEventListener('touchmove', function (event) {
        var touches = event.touches;
        if (touches.length === 1) {
            if (sliding) {
                var newValue = value + ((touches[0].pageX - startX) / slideBar.offsetWidth) * (maxValue - minValue);
                startX = touches[0].pageX;
                slider.setValue(newValue);
            }
        }
    }, false);
}