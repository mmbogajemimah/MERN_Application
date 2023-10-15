import { useContext } from "react"
import { UserContext } from "../UserContext"
import { Link, Navigate, useParams } from "react-router-dom";

export default function AccountPage() {
    const { ready,user } = useContext(UserContext);
    const { subpage } = useParams();

    if(!ready){
        return 'Loading...';
    };

    if(ready && !user) {
        return <Navigate to={'/login'} />
    }

    console.log(subpage);

    function linkClasses (type=null) {
        let classes = 'py-2 px-6';
        if (type === subpage || (subpage === undefined && type === 'profile')) {
            classes += " bg-primary text-white rounded-full";
        }
        return classes
    }



    return (
        <div className="w-full flex justify-center mt-8 gap-2">
            <Link className={linkClasses('profile')} to={'/account'}>My Profile</Link>
            <Link className={linkClasses('bookings')} to={'/account/bookings'}>My Bookings</Link>
            <Link className={linkClasses('places')} to={'/account/places'}>My Places</Link>
        </div>
    )
}