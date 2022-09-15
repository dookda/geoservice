function initializeLiff() {
    liff.init({
        liffId: "1657470168-8VR7rMnd"
    }).then((e) => {
        if (!liff.isLoggedIn()) {
            liff.login();
        } else {
            getUserid();
        }
    }).catch((err) => {
        console.log(err);
    });
}

var url = 'https://rti2dss.com/p3200';
// var url = 'https://ca94-202-28-250-89.ngrok.io'

let getData = (usrid) => {
    axios.post(url + "/api/getuser", { usrid }).then((r) => {

        if (r.data.data.length > 0) {
            // console.log(r);
            // console.log(r.data.data[0].noti);
            r.data.data[0].noti == "yes" ? document.getElementById("chkUserid").checked = true : document.getElementById("chkUserid").checked = false
            // document.getElementById("displayName").value = r.data.data[0].noti;
        }
    })
}

let modal = new bootstrap.Modal(document.getElementById('modal'), {
    keyboard: false
})

let updateUser = async (chk) => {
    let obj = {
        usrid: document.getElementById("userId").value,
        data: {
            noti: chk
        }
    }
    console.log(obj);
    axios.post(url + "/api/updateuser", obj).then((r) => {
        modal.show();
        getData(usrid)
        setTimeout(async () => {
            modal.hide();
            await liff.closeWindow()
        }, 2000);
    })
}

let gotoOwnerPost = () => {
    location.href = "./../report_owner/index.html";
}

async function getUserid() {
    const profile = await liff.getProfile();
    document.getElementById("userId").value = await profile.userId;
    document.getElementById("profile").src = await profile.pictureUrl;
    document.getElementById("displayName").innerHTML = await profile.displayName;
    getData(await profile.userId)
}
initializeLiff()

var chkBox = document.getElementById('chkUserid');

chkBox.onchange = () => {
    if (document.getElementById('chkUserid').checked) {
        updateUser("yes")
    } else {
        updateUser("no")
    }

}