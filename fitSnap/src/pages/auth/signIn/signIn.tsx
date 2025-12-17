import { useState, type ChangeEvent, type FormEvent } from "react"
import ApiClient from "../../../utils/ApiClient.ts"
import { Button, Form } from "react-bootstrap"
import { useNavigate,NavLink } from "react-router-dom"
import logo from "../../../assets/Logo-FitSnap.png"


interface SignInForm {
    email: string,
    password: string
}

function SignIn() {
    const navigate = useNavigate()
    const [form, setForm] = useState<SignInForm>({
        email: "",
        password: ""
    })
    const [errorMsg, setErrorMsg] = useState<string>("")
    const onHandleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    setForm({
        ...form,
        [name]: value
    })

    setErrorMsg("") 
    }
 
    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
        const response = await ApiClient.post("/signin", form);

if (response.status === 200) {
  localStorage.setItem("token", response.data.token); // FIXED
  navigate("/progress", { replace: true });
}
    } catch (error: any) {
        if (error.response) {
      
        setErrorMsg(
            error.response.data.message || "Email atau password salah"
        )
        } else {
        setErrorMsg("Terjadi kesalahan, coba lagi nanti")
        }
    }
    }

 
    return (
  <div
    className="d-flex justify-content-center align-items-center"
    style={{ minHeight: "100vh", background: "#f5f6fa" }}
  >
    <div
      className="p-4 rounded shadow-sm"
      style={{ width: "100%", maxWidth: "380px", background: "#fff" }}
    >
      <div className="text-center mb-4">
        <img
          src={logo}
          alt="FitSnap Logo"
          width={200}
          className="mb-2"
        />
        <h4 className="fw-bold mb-1">FitSnap</h4>
        <small className="text-muted">
          Track • Share • Progress
        </small>
      </div>

      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            value={form.email}
            onChange={onHandleChange}
            name="email"
            type="email"
            placeholder="Enter your email"
            required
          />
        </Form.Group>

        <Form.Group className="mb-4" controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            value={form.password}
            onChange={onHandleChange}
            name="password"
            type="password"
            placeholder="Enter your password"
            required
          />
        </Form.Group>

        {errorMsg && (<div className="alert alert-danger py-2 text-center">{errorMsg}</div>)}

        <Button
          type="submit"
          variant="primary"
          className="w-100 mb-3"
        >
          Sign In
        </Button>

        <div className="text-center">
          <small className="text-muted">
            Belum punya akun?{" "}
            <NavLink to="/signup" className="text-decoration-none fw-semibold">
              Sign Up
            </NavLink>
          </small>
        </div>
      </Form>
    </div>
  </div>
)
}


export default SignIn