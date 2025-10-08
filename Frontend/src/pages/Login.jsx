import React, { useState } from "react";


export default function Login() {
const [form, setForm] = useState({ username: "", accountNumber: "", password: "" });
const [error, setError] = useState(null);
const [loading, setLoading] = useState(false);
const navigate = useNavigate();


function onChange(e) {
setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
}


async function handleSubmit(e) {
e.preventDefault();
setError(null);


if (!form.username || !form.accountNumber || !form.password) {
setError("Please fill all fields.");
return;
}


setLoading(true);
try {
const payload = {
username: form.username,
accountNumber: form.accountNumber,
password: form.password,
};


const resp = await loginCustomer(payload);


// Backend in this project returns token as `Token` (capital T)
const token = resp?.token || resp?.Token || resp?.accessToken || resp?.data?.token || resp?.data?.Token;
const user = resp?.user || resp?.User || resp?.data?.user || resp?.data?.User || { username: form.username };


if (token) {
  saveAuth({ token, user });
  navigate("/dashboard");
} else if (resp?.success === true) {
  // only allow if server explicitly says success (and you have a server-side session/cookie)
  saveAuth({ loggedIn: true, user });
  navigate("/dashboard");
} else {
  throw new Error(resp?.message || "Login did not return a token; login failed.");
}

} catch (err) {
setError(err.message || "Login request failed");
} finally {
setLoading(false);
}
}


return (
<div className="card p-3">
<h2>Login</h2>
<form onSubmit={handleSubmit}>
<input name="username" className="form-control mb-2" placeholder="Username" value={form.username} onChange={onChange} />
<input name="accountNumber" className="form-control mb-2" placeholder="Account number" value={form.accountNumber} onChange={onChange} />
<input type="password" name="password" className="form-control mb-2" placeholder="Password" value={form.password} onChange={onChange} />


{error && <div className="alert alert-danger">{error}</div>}


<button className="btn btn-primary" type="submit" disabled={loading}>
{loading ? "Logging in..." : "Login"}
</button>
</form>
</div>
);
}