export interface Movie { id:number; title:string; genre:string; duration:number; rating:string; language:string; description:string; poster:string; }
export interface Show { id:number; movieId:number; screen:string; date:string; time:string; price:number; rows:number; cols:number; availableSeats?:number; }
export interface ShowDetail extends Show { movie:Movie; bookedSeats:string[]; }
export interface Booking { id:string; showId:number; seats:string[]; name:string; email:string; total:number; status:'confirmed'|'cancelled'; createdAt:string; movieTitle?:string; date?:string; time?:string; screen?:string; }
