export const validateEmail=(email)=>{
    if(!email.trim()){
        return 'Email is required';
    }
    const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
        return 'Please enter a valid email address';
    }
    return null;
}

export const validatePassword=(password)=>{
    if(!password.trim()){
        return 'Password is required';
    }
    if(password.length<8){
        return 'Password must be at least 8 characters long';
    }
    if(!/(?=.*[A-Z])/.test(password)){
    return 'Password must contain at least one uppercase letter';
    }

    if(!/(?=.*[a-z])/.test(password)){
        return 'Password must contain at least one lowercase letter';
    }

    if(!/(?=.*[0-9])/.test(password)){
        return 'Password must contain at least one number';
    }

    if(!/(?=.*[!@#$%^&*])/.test(password)){
        return 'Password must contain at least one special character';
    }
    return null;
}


export const validateAvatar=(file)=>{
    if(!file){ return null; }
    const allowedTypes=['image/jpeg','image/png','image/jpg'];
    if(!allowedTypes.includes(file.type)){
        return 'Please select a valid image file (JPEG, PNG, JPG)';
    }
    const maxSize=5*1024*1024; //2MB in bytes
    if(file.size>maxSize){
        return 'Please select an image file smaller than 5MB';
    }
    return null;
}

export const getInitials=(name)=>{
    return name
    .split(' ')
    .map((word)=>word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0,2)
}