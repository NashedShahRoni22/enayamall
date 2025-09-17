import Container from '../../components/shared/Container'
import PublicRoute from '../../components/shared/public/PublicRoute'
import ResetPasswordForm from '../../components/forms/ResetPasswordForm'

export default function page() {
    return (
        <PublicRoute>
            <Container>
                <div className='max-w-2xl mx-auto py-[40px] lg:py-[80px]'>
                    <ResetPasswordForm/>
                </div>
            </Container>
        </PublicRoute>
    )
}
