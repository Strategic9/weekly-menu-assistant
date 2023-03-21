import { Input } from '@chakra-ui/react'
import { Dispatch, useEffect, useState } from 'react'
import ReactDatePicker from 'react-datepicker'

export const WeekPicker = ({
  setWeek,
  definedWeek
}: {
  setWeek: Dispatch<object>
  definedWeek?: object
}) => {
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  const onChange = (date) => {
    const week = getWeekRange(date)

    const [startDay, endDay] = week

    setWeek([startDay, endDay])

    setStartDate(startDay)
    setEndDate(endDay)
  }

  const getWeekRange = (date) => {
    // Find the start of the week by moving back to the nearest Monday
    const start = new Date(date)

    if (date.getDay() === 0) {
      start.setDate(date.getDate() - 6)
    } else {
      start.setDate(date.getDate() - date.getDay() + 1)
    }
    start.setHours(0)

    // Find the end of the week by moving forward to the nearest Sunday
    const end = new Date(date)
    if (date.getDay() === 0) {
      end.setDate(date.getDate())
    } else {
      end.setDate(date.getDate() - date.getDay() + 7)
    }
    end.setHours(0)

    // Return the range as an array of two dates
    return [start, end]
  }

  useEffect(() => {
    const selectedWeek = definedWeek ? new Date(definedWeek[0]) : new Date()
    onChange(selectedWeek)
  }, [])

  return (
    <Input
      as={ReactDatePicker}
      id="weekly-date-picker"
      selected={startDate}
      onChange={onChange}
      startDate={startDate}
      endDate={definedWeek ? definedWeek[1] : endDate}
      minDate={new Date()}
      calendarStartDay={1}
      fontSize={['sm', 'md']}
      size={['sm', 'md']}
      backgroundColor="white"
      w={['95%']}
      onKeyDown={(e) => {
        e.preventDefault()
      }}
    />
  )
}

export default WeekPicker
