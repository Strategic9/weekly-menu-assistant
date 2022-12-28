import { useEffect, useState } from 'react'
import ReactDatePicker from 'react-datepicker'

export const WeekPicker = ({ setWeek }) => {
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

    // Find the end of the week by moving forward to the nearest Sunday
    const end = new Date(date)
    if (date.getDay() === 0) {
      end.setDate(date.getDate())
    } else {
      end.setDate(date.getDate() - date.getDay() + 7)
    }

    // Return the range as an array of two dates
    return [start, end]
  }

  useEffect(() => {
    onChange(new Date())
  }, [])

  return (
    <ReactDatePicker
      selected={startDate}
      onChange={onChange}
      startDate={startDate}
      endDate={endDate}
      minDate={new Date()}
      calendarStartDay={1}
      inline
    />
  )
}

export default WeekPicker
