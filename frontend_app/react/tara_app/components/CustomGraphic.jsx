import InviteImage from "../assets/graphic/invite.svg"
import DeletionImage from "../assets/graphic/trash.svg"
import SearchImage from "../assets/graphic/look.svg"
import WelcomeImage from "../assets/graphic/riderflex.svg"


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