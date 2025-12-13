import { useState, type ChangeEvent, type FormEvent } from "react"
import { Button, Form } from "react-bootstrap"
import { NavLink } from "react-router"
import ApiClient from "../../../utils/ApiClient.ts"
 
interface SignUpForm {
    username: string,
    email: string,
    password: string
}
 
function SignUp() {
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
 
    const onSubmit = async (event : FormEvent<HTMLFormElement>) => {
        event.preventDefault()
 
        try {
            const response = await ApiClient.post("/signup", form)
 
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }
 
    return <div className="container mx-auto">
        <h1>Sign Up</h1>
        <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                    value={form.username}
                    onChange={onHandleChange}
                    name="username"
                    type="text"
                    placeholder="Username" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                    value={form.email}
                    onChange={onHandleChange}
                    name="email"
                    type="email"
                    placeholder="Email Address" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    value={form.password}
                    onChange={onHandleChange}
                    name="password"
                    type="password"
                    placeholder="Password" />
            </Form.Group>
            <Button type="submit" variant="primary">Sign Up</Button>
            <NavLink to="/signin" ><Button className="ms-2">Sign In</Button></NavLink>
        </Form>
    </div>
}
 
export default SignUp