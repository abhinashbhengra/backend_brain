export const imageValidator = (size, mime) =>{
 if(bytesToMb(size) > 2){
    return "Image size must be less than 2 MB"
  }
}

export bytesToMb = (bytes) =>{
  return bytes / (1024 * 1024)
}
