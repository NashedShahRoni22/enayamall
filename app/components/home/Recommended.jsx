import VerticalProductCard from "../shared/cards/VerticalProductCard";
import Container from "../shared/Container";

export default function Recommended() {
    return (
        <Container>
            <div className="py-10 md:py-20">
                <h5 className="text-xl md:text-3xl font-semibold text-primary text-center mb-8 md:mb-16">
                    Recommended by Enayamall
                </h5>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-8">
                    {
                        Array(5).fill(0).map((_, index) => <VerticalProductCard key={index}/> )
                    }
                </div>
            </div>
        </Container>
    )
}