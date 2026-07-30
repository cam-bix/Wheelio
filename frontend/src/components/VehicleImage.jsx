import { useEffect, useState } from 'react'
import carPlaceholder from '../assets/placeholder_image.jpg'
import { getVehicleImageUrl } from '../api/vehicles'

function VehicleImage({
  vehicleId,
  className,
  alt,
  tryImage = true,
}) {
  const [hasImageError, setHasImageError] = useState(false)

  useEffect(() => {
    setHasImageError(false)
  }, [vehicleId])

  const imageUrl =
    tryImage && !hasImageError ? getVehicleImageUrl(vehicleId) : carPlaceholder

  return (
    <img
      className={className}
      src={imageUrl}
      alt={alt}
      onError={() => setHasImageError(true)}
    />
  )
}

export default VehicleImage
