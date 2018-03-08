import {
  boxShadow
} from '../styles';


const verticalNaviStyle = {
  verticalNavi: {
    border: "none",
    position: "fixed",
    top: "0",
    left: "0",
    zIndex: "1",
    ...boxShadow,
    backgroundColor: "#333333",
    width: "70px",
    height: "100vh",
    margin: "0"
  }
}

export default  verticalNaviStyle
