import React, { useState, useEffect } from 'react'
import { useAppSelector } from 'redux/hooks'
import { FaMapMarkerAlt } from 'react-icons/fa'
import type { BmkgForecast, BmkgLocation } from '../../types/data'

export default function Weather() {
  const navigation = useAppSelector((state) => state.navigation)
  const [weatherData, setWeatherData] = useState<BmkgForecast | null>(null)
  const [locationInfo, setLocationInfo] = useState<BmkgLocation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Default area code for Yogyakarta (can be changed)
  // Using a common Yogyakarta area code - adjust if needed
  const AREA_CODE = '34.04.07.2001' // Example: Kelurahan code for Yogyakarta

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${AREA_CODE}`)

        if (!response.ok) {
          throw new Error('Failed to fetch weather data')
        }

        const data = await response.json()

        // Parse the BMKG API response structure
        // Structure: { lokasi: {...}, data: [{ lokasi: {...}, cuaca: [[...], [...], [...]] }] }
        if (data && data.data && data.data.length > 0) {
          const locationData = data.data[0]

          // Store location information
          if (locationData.lokasi) {
            setLocationInfo(locationData.lokasi)
          } else if (data.lokasi) {
            setLocationInfo(data.lokasi)
          }

          // cuaca is an array of arrays (3 days, each day has multiple forecasts)
          // Get the first day's forecasts (cuaca[0])
          if (locationData.cuaca && locationData.cuaca.length > 0 && locationData.cuaca[0].length > 0) {
            // Get the first forecast of the first day (current/next forecast)
            const firstForecast = locationData.cuaca[0][0]
            setWeatherData(firstForecast)
          } else {
            throw new Error('No forecast data available')
          }
        } else {
          throw new Error('No weather data available')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        console.error('Error fetching weather data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchWeatherData()

    // Refresh data every 30 minutes (data is updated 2 times per day)
    const interval = setInterval(fetchWeatherData, 30 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  // Only show weather if toggle is enabled
  if (!navigation.showWeather) {
    return null
  }

  if (loading) {
    return (
      <div className='absolute top-6 left-1/2 -translate-x-1/2 z-20'>
        <div className='bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm'>Memuat data cuaca...</div>
      </div>
    )
  }

  if (error || !weatherData) {
    return null // Don't show anything if there's an error
  }

  return (
    <div className='absolute bottom-24 left-1/2 -translate-x-1/2 z-20 w-full flex justify-center items-center '>
      <div className='bg-black/70 md:w-[30%] w-[90%] backdrop-blur-sm rounded-lg px-4 py-3 text-white text-xs'>
        <div className='flex items-center gap-4 flex-wrap justify-center'>
          {/* Date/Time */}
          {weatherData.local_datetime && (
            <div className='flex items-center gap-1'>
              <span className='text-gray-300'>Waktu:</span>
              <span className='font-medium'>
                {new Date(weatherData.local_datetime.replace(' ', 'T')).toLocaleString('id-ID', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          )}

          {/* Temperature */}
          {weatherData.t !== undefined && (
            <div className='flex items-center gap-1'>
              <span className='text-gray-300'>Suhu:</span>
              <span className='font-medium'>{weatherData.t}°C</span>
            </div>
          )}

          {/* Humidity */}
          {weatherData.hu !== undefined && (
            <div className='flex items-center gap-1'>
              <span className='text-gray-300'>Kelembapan:</span>
              <span className='font-medium'>{weatherData.hu}%</span>
            </div>
          )}

          {/* Wind Speed */}
          {weatherData.ws !== undefined && (
            <div className='flex items-center gap-1'>
              <span className='text-gray-300'>Angin:</span>
              <span className='font-medium'>{weatherData.ws} km/jam</span>
            </div>
          )}
        </div>
        <div className='text-center mt-2  flex flex-row justify-center gap-2 items-center'>
          {locationInfo && (
            <div className='flex items-center gap-1 text-[10px] text-gray-300'>
              <FaMapMarkerAlt className='h-3 w-3' />
              <span>
                {locationInfo.desa && `${locationInfo.desa}, `}
                {locationInfo.kecamatan && `${locationInfo.kecamatan}, `}
                {locationInfo.kotkab && locationInfo.kotkab}
              </span>
            </div>
          )}
          <div className='text-[10px] text-gray-400'>Sumber: BMKG</div>
        </div>
      </div>
    </div>
  )
}
