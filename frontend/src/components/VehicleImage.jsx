import { useState } from 'react'
import carPlaceholder from '../assets/placeholder_image.jpg'
import { getVehicleImageUrl } from '../api/vehicles'

function VehicleImage({
  vehicleId,
  className,
  alt,
  tryImage = true,
}) {
  const [imageError, setImageError] = useState({
    vehicleId,
    hasError: false,
  })

  const hasImageError =
    imageError.vehicleId === vehicleId && imageError.hasError

  const imageUrl =
    tryImage && !hasImageError ? getVehicleImageUrl(vehicleId) : carPlaceholder

  return (
    <img
      className={className}
      src={imageUrl}
      alt={alt}
      onError={() => setImageError({ vehicleId, hasError: true })}
    />
  )
}

export default VehicleImage
