import { Suspense } from 'react'
import Login from '../components/forms/Login'
import AuthHeader from '../components/shared/AuthHeader'
import Container from '../components/shared/Container'
import PublicRoute from '../components/shared/public/PublicRoute'

export default function page() {
    return (
        <PublicRoute>
            {/* <AuthHeader title={"Login"} from={"Home"} to={"login"} /> */}
            <Container>
                <div className='max-w-2xl mx-auto py-[40px] lg:py-[80px]'>
                    <Suspense>
                        <Login />
                    </Suspense>
                </div>
            </Container>
        </PublicRoute>
    )
}
