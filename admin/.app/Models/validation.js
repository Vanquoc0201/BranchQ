import { getEleId } from "../Controllers/main.js";
class Validation {
    checkEmpty (value, divId, mess){
        if(!value){
            getEleId(divId).innerHTML = mess;
            getEleId(divId).style.display = "block"
            return false;
        } 
            getEleId(divId).innerHTML= "";
            getEleId(divId).style.display = "none";
            return true;
    }
    checkSelect(idSelect,divId,mess){
        if(getEleId(idSelect).selectedIndex === 0){
            getEleId(divId).innerHTML = mess;
            getEleId(divId).style.display = "block"
            return false;
        }
        getEleId(divId).innerHTML= "";
        getEleId(divId).style.display = "none";
        return true;
    }
    checkCharacterString(value,divId,mess){
        const letter = "^[a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶ" + "ẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợ" + "ụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\s]+$";
        if(value.match(letter)){
            getEleId(divId).innerHTML= "";
            getEleId(divId).style.display = "none";
            return true;
        }
         getEleId(divId).innerHTML = mess;
        getEleId(divId).style.display = "block"
        return false;
    }
    checkPrice(value, divId, mess) {
        const price = 	/^[0-9]+$/;
        if (value.match(price)) {
            getEleId(divId).innerHTML= "";
            getEleId(divId).style.display = "none";
            return true;
        }
         getEleId(divId).innerHTML = mess;
        getEleId(divId).style.display = "block"
        return false;
    }
}
export default Validation;