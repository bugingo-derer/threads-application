import { useState } from "react";
import useShowToast from "./useShowToast.js";

const usePreviewImg = () => {
  const [imgUrl, setImgUrl] = useState(null);
  const showToast = useShowToast();

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if(file && file.type.startsWith("image/")){
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgUrl(reader.result);
      }

      reader.readAsDataURL(file)
    } else {
      showToast("Invalid file type", "please select an image-type-file", "error");
      setImgUrl(null);
    }
  }
  return { handleImageChange, imgUrl, setImgUrl }
}

export default usePreviewImg