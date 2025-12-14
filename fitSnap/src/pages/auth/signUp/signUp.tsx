import { useState, type ChangeEvent, type FormEvent } from "react"
import { Button, Form } from "react-bootstrap"
import { NavLink, useNavigate } from "react-router-dom"
import ApiClient from "../../../utils/ApiClient.ts"
import logo from "../../../assets/Logo-FitSnap.png"
 
interface SignUpForm {
    username: string,
    email: string,
    password: string
}
 
function SignUp() {
    const navigate = useNavigate()
    const [form, setForm] = useState<SignUpForm>({
        username: "",
        email: "",
        password: ""
    })
 
    const onHandleChange = (event : ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target
 
        setForm({
            ...form,
            [name] : value
        })
    }
 
    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
        const response = await ApiClient.post("/signup", form)

        if (response.status === 201 || response.status === 200) {
        navigate("/signin", { replace: true })
        }
    } catch (error) {
        console.log(error)
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
      <h4 className="fw-bold text-center mb-4">Create Account</h4>
        </div>

      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            value={form.username}
            onChange={onHandleChange}
            name="username"
            type="text"
            placeholder="Enter username"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            value={form.email}
            onChange={onHandleChange}
            name="email"
            type="email"
            placeholder="Enter email"
            required
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Password</Form.Label>
          <Form.Control
            value={form.password}
            onChange={onHandleChange}
            name="password"
            type="password"
            placeholder="Enter password"
            required
          />
        </Form.Group>

        <Button type="submit" variant="primary" className="w-100 mb-3">
          Sign Up
        </Button>

        <div className="text-center">
          <small className="text-muted">
            Sudah punya akun?{" "}
            <NavLink
              to="/signin"
              className="text-decoration-none fw-semibold"
            >
              Sign In
            </NavLink>
          </small>
        </div>
      </Form>
    </div>
  </div>
)

}
 
export default SignUp