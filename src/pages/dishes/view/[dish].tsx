import {
  Spinner,
  Flex,
  Image,
  Button,
  ListItem,
  UnorderedList,
  Heading,
  Text,
  Icon,
  Box
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useDish } from '../../../services/hooks/useDishes'
import { RiEditLine } from 'react-icons/ri'
import Link from 'next/link'
import PageWrapper from '../../page-wrapper'
import React, { useEffect, useState } from 'react'
import { RiStarFill, RiStarHalfFill, RiStarLine, RiTimer2Line, RiUser6Line } from 'react-icons/ri'
import { placeholderImage } from '../../../services/utils'
import {
  GetMeasurementUnitsResponse,
  useMeasurementUnits
} from '../../../services/hooks/useMeasurementUnit'
import { useContext } from 'react'
import { AppContext } from '../../../contexts/AppContext'

export default function ViewDishPage() {
  const router = useRouter()
  const { dish: dish_id } = router.query
  const { data } = useDish(dish_id as string)
  const totalStars = Array.from(Array(4 + 1), (_, i) => i)
  const { role } = useContext(AppContext)

  const { data: useMeasurementUnitsData } = useMeasurementUnits(
    null,
    {},
    {
      'page[limit]': 1000,
      'page[offset]': 0
    }
  )

  const measurementUnitsData = useMeasurementUnitsData as GetMeasurementUnitsResponse

  const [localData, setLocalData] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (data) {
      setLocalData(data)
      setLoading(false)
    } else {
      setLoading(true)
    }
  }, [data])

  const Stars = ({ rate, index }) => {
    if (index < rate && rate < index + 1) {
      return <Icon color={'oxblood.300'} as={RiStarHalfFill} />
    } else if (index < rate) {
      return <Icon color={'oxblood.300'} as={RiStarFill} />
    } else {
      return <Icon color={'oxblood.300'} as={RiStarLine} />
    }
  }

  const Information = ({ dish }) => (
    <Flex
      bgGradient="linear(to-r, tan.200, white)"
      borderRadius={4}
      padding={4}
      color={'oxblood.400'}
      mb={6}
    >
      <Box display="flex" alignItems="center">
        <Icon as={RiTimer2Line} fontSize={['16', '16', '20']} mr={1} />
        <Text fontSize={['14', '14', '16']}>
          {dish.dish?.cookingTime ? dish.dish.cookingTime : '--'}
        </Text>
      </Box>
      <Box mr={2} ml={2}></Box>
      <Box display="flex" alignItems="center">
        <Icon as={RiUser6Line} mr={1} fontSize={['16', '16', '20']} />
        <Text fontSize={['14', '14', '16']}>{dish.dish?.portions ? dish.dish.portions : '--'}</Text>
      </Box>
      <Box mr={2} ml={2}>
        |
      </Box>
      <Box display="flex" alignItems="center">
        {totalStars.map((arr, index) => (
          <Stars key={index} index={index} rate={dish.dish?.rate} />
        ))}
      </Box>
    </Flex>
  )

  const getMeasurementUnit = (id, measurementUnits) => {
    const measurementUnit = measurementUnits?.items.find((unitId) => unitId.id === id)
    return <span>{measurementUnit?.value} </span>
  }

  const sortIngredients = (ingredients) => {
    const sortedIngredients = ingredients.sort((a, b) => {
      return a.isMain - b.isMain
    })
    return sortedIngredients.reverse()
  }

  const DesktopView = ({ data }) => (
    <Flex display={['none', 'none', 'flex']} width="100%">
      <Flex flexDirection="column" mr={4} bgColor="white" borderRadius={8} padding={4}>
        <Image
          src={data?.dish?.image ? data?.dish?.image : placeholderImage}
          alt="Dish Image"
          maxH={['140px', '140px', '140px']}
          borderRadius={8}
          mb={6}
        />
        <Heading
          as="h4"
          size="md"
          mb={4}
          borderBottom="solid"
          borderColor="gray.200"
          borderBottomWidth="thin"
          pb={2}
        >
          Ingredients
        </Heading>
        <UnorderedList>
          {sortIngredients(data?.dish?.ingredients).map((ingredient) => (
            <ListItem _first={{ fontWeight: '700' }} key={ingredient.grocery.id}>
              <span>{ingredient.quantity}</span>
              {getMeasurementUnit(ingredient.measurementUnitId, measurementUnitsData)}
              {ingredient.grocery.name}
            </ListItem>
          ))}
        </UnorderedList>
      </Flex>
      <Flex
        justifyContent="space-between"
        bgColor="white"
        borderRadius={8}
        padding={4}
        width="70%"
        flexDirection="column"
      >
        <Heading
          as="h1"
          size="lg"
          mb={2}
          borderBottom="solid"
          borderColor="gray.200"
          borderBottomWidth="thin"
          pb={2}
        >
          <Flex justifyContent="space-between">
            {data?.dish?.name}

            {role === 'admin' && (
              <Link href={`/dishes/edit/${data?.dish?.id}`} passHref>
                <Button
                  pl={4}
                  aria-label="edit dish"
                  size="sm"
                  bg="gray.200"
                  leftIcon={<Icon as={RiEditLine} fontSize="16" />}
                  iconSpacing="0"
                />
              </Link>
            )}
          </Flex>
        </Heading>
        <Text as="i" fontSize={14} mb={4}>
          {data?.dish?.description ? data?.dish?.description : null}
        </Text>
        <Information dish={data} />
        <Heading
          as="h4"
          size="md"
          mb={4}
          borderBottom="solid"
          borderColor="gray.200"
          borderBottomWidth="thin"
          pb={2}
        >
          Method
        </Heading>
        <Text style={{ whiteSpace: 'pre-line' }} fontSize="md">
          {data?.dish?.recipe ? data?.dish?.recipe : 'No recipe was provided for this dish.'}
        </Text>
      </Flex>
    </Flex>
  )

  const MobileView = ({ data }) => (
    <Flex display={['flex', 'flex', 'none']} flexDirection="column" width="100%">
      <Flex flexDirection="column" bgColor="white" borderRadius={8} padding={4} mb={5}>
        <Heading
          as="h1"
          size="lg"
          mb={2}
          borderBottom="solid"
          borderColor="gray.200"
          borderBottomWidth="thin"
          pb={2}
        >
          <Flex justifyContent="space-between">
            {data?.dish?.name}{' '}
            <Link href={`/dishes/edit/${data?.dish?.id}`} passHref>
              <Button
                aria-label="edit dish"
                size="sm"
                bg="gray.200"
                leftIcon={<Icon as={RiEditLine} fontSize="16" />}
                iconSpacing="0"
              />
            </Link>
          </Flex>
        </Heading>
        <Text as="i" fontSize={14} mb={4}>
          {data?.dish?.description ? data?.dish?.description : null}
        </Text>
        <Information dish={data} />
        <Image
          src={data?.dish?.image ? data?.dish?.image : placeholderImage}
          alt="Dish Image"
          borderRadius={8}
        />
      </Flex>
      <Flex bgColor="white" borderRadius={8} padding={4} mb={8} flexDirection="column">
        <Flex mb={6} borderRadius={8} flexDirection="column">
          <Heading
            as="h4"
            size="md"
            mb={4}
            borderBottom="solid"
            borderColor="gray.200"
            borderBottomWidth="thin"
            pb={2}
          >
            Ingredients
          </Heading>
          <UnorderedList>
            {sortIngredients(data?.dish?.ingredients).map((ingredient) => (
              <ListItem _first={{ fontWeight: '700' }} key={ingredient.grocery.id}>
                <span>{ingredient.quantity}</span>
                {getMeasurementUnit(ingredient.measurementUnitId, measurementUnitsData)}
                {ingredient.grocery.name}
              </ListItem>
            ))}
          </UnorderedList>
        </Flex>
        <Heading
          as="h4"
          size="md"
          mb={4}
          borderBottom="solid"
          borderColor="gray.200"
          borderBottomWidth="thin"
          pb={2}
        >
          Method
        </Heading>
        <Text style={{ whiteSpace: 'pre-line' }} fontSize="md">
          {data?.dish?.recipe ? data?.dish?.recipe : 'No recipe was provided for this dish.'}
        </Text>
      </Flex>
    </Flex>
  )

  return (
    <PageWrapper>
      {loading ? (
        <Flex w="100%" h={40} m="auto">
          <Spinner />
        </Flex>
      ) : (
        <Flex>
          <DesktopView data={localData} />
          <MobileView data={localData} />
        </Flex>
      )}
    </PageWrapper>
  )
}
