const greetingGenerator =(deparment,company)=>{
    return (firstName,lastName,timeofDay) =>{
        console.log(
`Good ${timeofDay},${firstName} ${lastName}!Welcome to the ${deparment} deparment at ${company}`
        );
    };
};

const hrGreeting = greetingGenerator("HR","cts");

hrGreeting("Riya", "sharma","morning");
hrGreeting("Mahi", "lucky","afternoon");
hrGreeting("sri", "patel","evening");