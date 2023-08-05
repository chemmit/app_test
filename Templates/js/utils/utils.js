// base url
let base_url = 'http://localhost:8000'

Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});

// date convertion
let date_convert = (date) => {
    var d = new Date (date)
            const option = {
                day:"numeric",
                month:"short",
                year:"numeric",
                weekday:'long'
               
            };
            
            return d.toLocaleDateString("en-GB", option)

}

let get_time=(time)=>{
    if(time !== null){
    const [hours, minutes] = time.split(':').map(Number)
const date = new Date()
date.setHours(parseInt(hours))
date.setMinutes(parseInt(minutes))
console.log('ss', date.getTime())
return date.getTime()
    }
    

}

let divideTimeByTwo = (time)=>{
    if(time !== null){
    const [hours,minutes] = time.split(':').map(Number)
    const total_seconds = hours*3600+minutes*60
    const half_time = total_seconds/2

    const new_hours = Math.floor(half_time/3600)
    const new_minutes = Math.floor(half_time%3600)/60
 //   const new_seconds = Math.floor(half_time%60)
    // `${String(new_hours).padStart(2,'0')}:${String(new_minutes).padStart(2,'0')}`
     return `${String(new_hours).padStart(2,'0')}:${String(new_minutes).padStart(2,'0')}`
   // return half_time
    }
    
}

let time_convert = (datetime) => {
    var date = new Date(datetime)
    var hour = date.getUTCHours().toString().padStart(2,'0')
    var minutes = date.getUTCMinutes().toString().padStart(2,'0')
    var seconds = date.getUTCSeconds().toString().padStart(2,'0')

    // var local_time = date.toLocaleString()
    return `${hour}:${minutes}:${seconds}`
} 
let updateStatus = (hours_worked, hours_needed, login_time, late_time) =>{
    //  console.log('kdud',login_time,late_time, login_time > late_time);
     console.log('bhhnjh',hours_worked,hours_worked >= divideTimeByTwo(hours_needed));
   //  console.log('log < late',login_time,late_time, login_time < late_time,hours_worked,'>=',hours_needed,hours_worked > hours_needed || hours_worked === hours_needed)
    if(hours_worked >= hours_needed && login_time < late_time){
        // console.log('p')
        return 'Present'
    }else if(hours_worked >= divideTimeByTwo(hours_needed) && hours_worked < hours_needed || login_time > late_time && hours_worked >= divideTimeByTwo(hours_needed) )
    {
        // console.log('h')
        return 'Half Day'
    }else{
        return 'Absent'
    }

}

let removeDuplicates = (data) => {
    
    let uniqueObj = {}
    let max_value = {}
    let result = []

for(let key in data){
        
      
        let value = data[key]['Date']
        let id = data[key]['FK_emp_id']
        let val = value + id
        if(val in max_value && key['Login_Time'] > max_value[val]){
            max_value[val] = data[key]['Login_Time']
            
        }else if(!(val in uniqueObj)){
            max_value[val] = data[key]['Login_Time']
    
        }
       
   
    
           
       

   
}


for(let key in data){
    
    
    let value = data[key]['Date']
    let id = data[key]['FK_emp_id']
    let val = value + id
    // console.log('va',val)
    
    if(val in uniqueObj && key['Login_Time'] < uniqueObj[val]['Login_Time']){
        // uniqueObj[value]['Logout_Time'] = uniqueObj[value]['Login_Time']
        
        uniqueObj[val] = data[key]
    }else if(!(val in uniqueObj)){
        uniqueObj[val] = data[key]
        
    }
    if(max_value.hasOwnProperty(val)){
        uniqueObj[val]['Logout_Time'] = max_value[val]
        uniqueObj[val]['total_hours'] = timeDifference(uniqueObj[val]['Login_Time'], uniqueObj[val]['Logout_Time'])
        uniqueObj[val]['IsNotPresent'] = uniqueObj[val]['total_hours'] && uniqueObj[val]['working_hours'] ? updateStatus(uniqueObj[val]['total_hours'], uniqueObj[val]['working_hours'], time_convert(uniqueObj[val]['Login_Time']), uniqueObj[val]['late_time']):'Absent'
        // divideTimeByTwo(uniqueObj[val]['working_hours'])<=uniqueObj[val]['total_hours'] && uniqueObj[val]['working_hours'] <= uniqueObj[val]['total_hours']?'P':'A'
    }

    // console.log('halsjkks',get_time(divideTimeByTwo(uniqueObj[val]['working_hours'])),get_time(timeDifference(uniqueObj[val]['Login_Time'], uniqueObj[val]['Logout_Time'])));
    console.log(uniqueObj[val]['FK_emp_id'], uniqueObj[val]['working_hours'] <= uniqueObj[val]['total_hours'])
    console.log( uniqueObj[val]['total_hours'])
   
            
            
        }
        // console.log('max',max_value)
    //     console.log('max_value',max_value)
    //  console.log('uni',uniqueObj)
    for(let key in uniqueObj){
        result.push(uniqueObj[key])

    }
    return result
}


let timeDifference = (login_time, logout_time) => {
let date1 = new Date(login_time)
let date2 = new Date(logout_time)
// console.log('loo',time_convert(date2-date1))
return date2 >  date1 ? time_convert(date2 - date1):null;
} 
