import { Suspense } from 'react'
import Register from '../components/forms/Register'
import Container from '../components/shared/Container'
import PublicRoute from '../components/shared/public/PublicRoute'

export default function page() {
    return (
        <PublicRoute>
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
