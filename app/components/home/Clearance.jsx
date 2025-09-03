import Container from '../shared/Container'
import VerticalProductCard from '../shared/cards/VerticalProductCard'

export default function Clearance() {
    return (
        <Container>
            <div className="py-10 md:py-20">
                <h5 className="text-xl md:text-3xl font-semibold text-primary mb-8 md:mb-16">
                    Clearance Sale | Up to 70% OFF
                </h5>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
                    {
                        Array(4).fill(0).map((_, index) => <VerticalProductCard key={index} />)
                    }
                </div>
            </div>
        </Container>
    )
}
