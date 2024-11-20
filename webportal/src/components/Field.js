import field from './../assets/field.jpg'

const Field = ({team_1, team_2}) => {

    return(
        <div>
            <img src={field} alt="field" className="w-full h-auto object-coverr"/>
        </div>
    )
}
export default Field;