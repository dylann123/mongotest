window.fetch("http://localhost:3001/user/loggedin", {
	method: "GET",
	credentials: "include"
}).then(response => {
	return response.json();
}).then(data => {
	if (!data["value"]) {
		setTimeout(() => {
			window.location.href = "http://localhost/index.html";
		}, 1000);
	}
});

const user = {
	host: "http://localhost:3001/user/",
	signout: () => {
		fetch(user.host + 'logout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify({})
		}).then(() => {
			location.reload()
		})
	},

	getuserinfo: () => {
		fetch(user.host + 'getuserinfo', {
			method: 'GET',
			credentials: 'include',
		})
			.then(res => res.text())
			.then(data => document.getElementById("user-userdata").innerHTML = JSON.stringify(data, null, 4))
	},

	loggedin: () => {
		fetch(user.host + 'loggedin', {
			method: 'GET',
			credentials: 'include',
		})
			.then(res => res.text())
			.then(data => document.getElementById("user-loginstatus").innerHTML = JSON.stringify(data, null, 4))
	}
}

document.addEventListener('DOMContentLoaded', () => {
	if (!document.cookie.includes("id")) {
		document.getElementById("user-id").innerHTML = "Not logged in...redirecting..."
		setTimeout(() => {
			window.location.href = "http://localhost/"
		}, 2000)
	} else
		document.getElementById("user-id").innerHTML = document.cookie.split(";").find(c => c.includes("id")).split("=")[1]

})