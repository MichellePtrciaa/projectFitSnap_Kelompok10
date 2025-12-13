import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
        {
            path : "/", 
            children : [
                {
                    index : true,
                    lazy : {
                        Component : async() => {
                            const component = await import("../pages/fitSnap/progress.tsx")
                            return component.default
                        }
                    }
                },
                {
                path : "signUp",
                lazy : {
                    Component : async() => {
                        const component = await import("../pages/auth/signUp/signUp.tsx")
                        return component.default
                    }
                }
            },
            {
                path : "signIn",
                lazy : {
                    Component : async() => {
                        const component = await import("../pages/auth/signIn/signIn.tsx")
                        return component.default
                    }
                }
            },
            {
                path : "add-progress",
                lazy : {
                    Component : async() => {
                        const component = await import("../pages/fitSnap/addProgress.tsx")
                        return component.default
                    }
                }
            },
            ]
        }
    ])

export default router