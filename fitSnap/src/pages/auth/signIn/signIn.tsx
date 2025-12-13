import { useState, type ChangeEvent, type FormEvent } from "react"
import ApiClient from "../../../utils/ApiClient.ts"
import { Button, Form, NavLink } from "react-bootstrap"
import { useNavigate } from "react-router"

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
            const response = await ApiClient.post("/signin", form)
 
            console.log(response);

            if (response.status==200){
                localStorage.setItem("token", response.data.data.token)
                navigate("/movie", {
                    replace : true
                })
            }
        } catch (error) {
            console.log(error);
        }
    }
 
    return <div className="container mx-auto">
        <h1>Sign In</h1>
        <Form onSubmit={onSubmit}>
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
            <Button type="submit" variant="primary">Sign In</Button>
            
        </Form>
    </div>
}

export default SignIn