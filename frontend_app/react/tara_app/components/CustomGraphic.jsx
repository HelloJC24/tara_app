import InviteImage from "../assets/graphic/invite.svg"
import DeletionImage from "../assets/graphic/trash.svg"
import SearchImage from "../assets/graphic/look.svg"
import WelcomeImage from "../assets/graphic/riderflex.svg"
import IDImage from "../assets/graphic/id.svg"
import TipImage from "../assets/graphic/tip.svg"
import UptimeImage from "../assets/graphic/uptime.svg"
import SelectTara from "../assets/graphic/tarasafeselect.svg"
import AskLocation from "../assets/graphic/location-permi.svg"
import AskCamera from "../assets/graphic/camera-permission.svg"
import AskGate from "../assets/graphic/sadsad.svg"
import EmptyIcon from "../assets/graphic/empty.svg"
import SearchBa from "../assets/graphic/search.svg"
import MockMap from "../assets/graphic/device.svg"

export const InviteGraphic = (props) => {
    return (
      <InviteImage width={props.size} height={props.size} fill={props.color} />
    );
  }

export const DeletionGraphic = (props) => {
return (
    <DeletionImage width={props.size} height={props.size} fill={props.color} />
);
}

export const SearchingGraphic = (props) => {
return (
<SearchImage width={360} height={props.size} fill={props.color} />
);
}

export const WelcomeGraphic = (props) => {
return (
    <WelcomeImage width={props.size} height={props.size} fill={props.color} />
);
}

export const IDGraphic = (props) => {
return (
    <IDImage width={props.size} height={props.size} fill={props.color} />
);
}


export const TipGraphic = (props) => {
return (
    <TipImage width={props.size} height={props.size} fill={props.color} />
);
}


export const UptimeGraphic = (props) => {
    return (
        <UptimeImage width={props.size} height={props.size} fill={props.color} />
    );
    }

export const TaraSafeGraphic = (props) => {
return (
    <SelectTara width={props.size} height={props.size} fill={props.color} />
);
}

export const TaraPermission = (props) => {
    return (
        <AskLocation width={props.size} height={props.size} fill={props.color} />
    );
    }


export const TaraCamPermission = (props) => {
return (
<AskCamera width={props.size} height={props.size} fill={props.color} />
);
}

export const TaraGate = (props) => {
    return (
    <AskGate width={props.size} height={props.size} fill={props.color} />
    );
    }

export const TaraEmpty = (props) => {
return (
<EmptyIcon width={props.size} height={props.size} fill={props.color} />
);
}

export const TaraSearch = (props) => {
return (
<SearchBa width={props.size} height={props.size} fill={props.color} />
);
}

export const TaraMock = (props) => {
    return (
    <MockMap width={props.size} height={props.size} fill={props.color} />
    );
    }