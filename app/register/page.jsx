import { Suspense } from 'react'
import Register from '../components/forms/Register'
import AuthHeader from '../components/shared/AuthHeader'
import Container from '../components/shared/Container'
import PublicRoute from '../components/shared/public/PublicRoute'

export default function page() {
    return (
        <PublicRoute>
            <AuthHeader title={"Register"} from={"Home"} to={"register"} />
            <Container>
                <div className='max-w-2xl mx-auto py-[40px] lg:py-[80px]'>
                    <Suspense>
                        <Register />
                    </Suspense>
                </div>
            </Container>
        </PublicRoute>
    )
}
