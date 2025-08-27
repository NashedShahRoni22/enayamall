'use client'

import React, { Suspense, useState } from 'react'
import AuthHeader from '../components/shared/AuthHeader'
import Container from '../components/shared/Container'
import Login from '../components/forms/Login'
import Register from '../components/forms/Register'

export default function Page() {
  const [option, setOption] = useState(1);
  return (
    <section>
      <AuthHeader title={"Account"} from={"Home"} to={"Account"} />
      <Container>
        <div className='grid gap-[60px] lg:gap-[240px] lg:grid-cols-2 py-[60px] lg:py-[120px]'>
          <Suspense>
            <Login option={option} setOption={setOption} />
            <Register option={option} setOption={setOption} />
          </Suspense>
        </div>
      </Container>
    </section>
  )
}
