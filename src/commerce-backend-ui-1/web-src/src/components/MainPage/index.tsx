/*
 * <license header>
 */

import React, { useState, useEffect } from 'react'
import { View, Flex, ProgressCircle, Text } from '@adobe/react-spectrum'
import type { MainPageProps } from './types'
import { attach } from '@adobe/uix-guest'
import { EXTENSION_ID } from '@web/types/constants'
import { MainContainer } from '@adobe-commerce/aio-experience-kit'
import HomeIcon from '@spectrum-icons/workflow/Home'
import ShoppingCartIcon from '@spectrum-icons/workflow/ShoppingCart'

export const MainPage: React.FC<MainPageProps> = ({ runtime: _runtime, ims }) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCredentials = async () => {
      if (!ims.token) {
        const guestConnection = await attach({ id: EXTENSION_ID })
        ims.token = guestConnection?.sharedContext?.get('imsToken')
        ims.org = guestConnection?.sharedContext?.get('imsOrgId')
        console.log('ims object', ims)
      }
      setIsLoading(false)
    }

    fetchCredentials()
  }, [])

  const navigationButtons = [
    {
      label: 'Home',
      path: '/',
      icon: <HomeIcon size={'S'} gridArea="Home" marginEnd={'size-100'} />
    },
    {
      label: 'Products',
      path: '/products',
      icon: <ShoppingCartIcon size={'S'} gridArea="Products" marginEnd={'size-100'} />
    }
  ]
  const appRoutes = [
    {
      paths: ['/'],
      component: <Text>Home</Text>
    },
    {
      paths: ['/products'],
      component: <Text>Products</Text>
    }
  ]

  const renderContent = () => (
    <View>
      {isLoading ? (
        <Flex alignItems="center" justifyContent="center" height="100vh">
          <ProgressCircle size="L" aria-label="Loading…" isIndeterminate />
        </Flex>
      ) : (
        <View width="size-6000">
          <MainContainer buttons={navigationButtons} routes={appRoutes} />
        </View>
      )}
    </View>
  )

  return renderContent()
}
