import VerticalCardSkleton from './VerticalCardSkleton'
import Container from '../shared/Container'

export default function VerticalCardLoadingScreen({value}) {
    return (
        <Container>
            <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-${value} gap-[20px] mt-[60px] mb-[50px] lg:mb-[120px]`}>
                {[...Array(value)].map((_, i) => (
                    <VerticalCardSkleton key={i} />
                ))}
            </div>
        </Container>
    )
}
