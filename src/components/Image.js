import { React, useState } from 'react'
import styles from '../styles/image.module.css'

const Image = ({ zoom, ...rest }) => {
  const [click, setClick] = useState(false)

  const setFlag = () => {
    setClick(!click)
  }

  if (!zoom) return <img {...rest} />
  else
    return (
      <>
        {click ? (
          <div onClick={setFlag} className={`${styles.lightbox} ${styles.show} relative`}>
            <img {...rest} className={`${styles.show_image}`}></img>
          </div>
        ) : (
          <img {...rest}  width={75} height={75} onClick={setFlag}></img>
        )}
      </>
    )
}

export default Image
