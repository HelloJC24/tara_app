import TaraWallet from "../assets/custom-svg/wallet.svg"
import TaraIconSvg from "../assets/custom-svg/tara.svg"
import TaraMotorIcon from "../assets/graphic/taramotor.svg"
import TaraCarIcon from "../assets/graphic/taracar.svg"
import TaraVanIcon from "../assets/graphic/taravan.svg"

export const TaraWalletIcon = (props) => {
    return (
      <TaraWallet width={props.size} height={props.size} fill={props.color} />
    );
  }
  
export const TaraLogo = (props) => {
  return (
    <TaraIconSvg width={props.size} height={props.size} fill={props.color} />
  );
}

export const TaraMotor = (props) => {
  return (
    <TaraMotorIcon width={props.size} height={props.size} fill={props.color} />
  );
}

export const TaraCar = (props) => {
  return (
    <TaraCarIcon width={props.size} height={props.size} fill={props.color} />
  );
}

export const TaraVan = (props) => {
  return (
    <TaraVanIcon width={props.size} height={props.size} fill={props.color} />
  );
}