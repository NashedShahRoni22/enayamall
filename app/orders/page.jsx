"use client";
import Orders from '../components/account/Orders'
import PrivateRoute from '../components/shared/private/PrivateRoute'
import ScreenLoader from '../components/loaders/ScreenLoader';
import { useAppContext } from '../context/AppContext';
import { useGetDataWithToken } from '../components/helpers/useGetDataWithToken';
import Container from '../components/shared/Container';

export default function page() {
    const { token } = useAppContext();
    // get orders
    const { data: ordersData, isLoading, error } = useGetDataWithToken(`orders`, token);
    const orders = ordersData?.data;
    if (isLoading) return <ScreenLoader />
    if (error) return <div>Error: {error.message}</div>;
    return (
        <PrivateRoute>
            <Container>
                <h5 className='text-xl lg:text-3xl my-8 font-semibold text-primary'>My Orders</h5>
                <Orders orders={orders} />
            </Container>
        </PrivateRoute>
    )
}
