
document.getElementById('date_picker').value = new Date().toDateInputValue()
let n = new Date()
console.log('sddd',n)
const search_btn = document.getElementById('search')
let emp_attendance_data = (emp_code) => {
    console.log('emp_code',emp_code);
    document.getElementById('emp_code').value = ''
    document.getElementById('table').textContent = ''
    axios.get(`${base_url}/get_attendence_data/${emp_code}`).then((response)=>{
        console.log('res',response.data)
        table_creation(response.data)
   
        
    })
    
}

search_btn.addEventListener('click',(e)=>{
    e.preventDefault();
    let emp_code = document.getElementById('emp_code').value
   
    emp_attendance_data(emp_code)
    
   
    

})

 // logout

 document.getElementById('logout').addEventListener('click',(e) => {

    e.preventDefault();

    // make api request

    fetch(`${base_url}/logout`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
            'refresh_token': localStorage.getItem('refreshToken')
        })
    }).then(response => response.json()).then((data) => {
        if(data.message){

         
            
            // clear access token and refresh token

            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')

            // redirect to login page

            window.location.href = '/Templates/Login.html'
        }
        else    {
            console.log('error',error);
        }

    }).catch(error => console.log(error))
});

// function for refresh token

let refreshAccessToken = () => {
    const refreshToken = localStorage.getItem('refreshToken')
    if(refreshToken){

        // make api request

        fetch(`${base_url}/api/token/refresh/`,
        {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json; charset=UTF-8',
            
        },
            body: JSON.stringify({
                'refresh': refreshToken
            })
        })
        .then(response => response.json())
        .then((data) => {
            if(data.access){

                // store new access token
                localStorage.setItem('accessToken', data.access)

                // store refresh token
                localStorage.setItem('refreshToken', data.refresh)

                // verify new  access token
                verifyAccessToken()

            }else{

                // redirect to login page
                window.location.href = '/Templates/Login.html'
            }
            console.log('data', data)
            
        }).catch(error => {
            console.log('error', error)
        })

    }
    else{
        // redirect to login page when refresh token is not present
        window.location.href = '/Templates/Login.html'
    }

}

// function to access token verification

let verifyAccessToken = () => {

    fetch(`${base_url}/api/token/verify/`,
        {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
            'token': localStorage.getItem('accessToken')
        })
    })
        .then(response => response.json())
        .then((data) => {
          //  console.log('data',data)
            if(data.code == 'token_not_valid'){

               // console.log(data.code)
               // window.location.href = '/Templates/Login.html'

               // access token expired try to refresh it
               refreshAccessToken();
            }
        })


}






let table_creation = (response_data) => {

    const title = [
    'Emp Id',
    'Date',
    'Login Time',
    'Logout Time',
    'Status',
    // "Late",
    // 'Late Time',
    // 'Working Hours',
    'Total Hours',
    
    ]
    
    // let timeDiff=(time1,time2)=>{
    //    // login time
    //     let time = time_convert(time2)
       
        
    //     return time !== null && time1 !== null && time>time1? time_convert(get_time(time)-get_time(time1)):""
        
       
    // }


var data = removeDuplicates(response_data)   
const table = document.getElementById('table')

   
    
const tablehead = document.createElement('thead')

const row = document.createElement('tr')

for(const index in title){
    // console.log(title[index])
    const head = document.createElement('td')
    head.textContent = title[index]
    row.appendChild(head)
}
tablehead.appendChild(row)
table.appendChild(tablehead)
    // creating table body
    const tablebody = document.createElement('tbody')
    tablebody.classList.add('tablebody')
    
    data.map((data) => {

        // creating table row
        const row = document.createElement('tr')
        
        for(const key in data){
            
            // creating table data
            if(key==='Login_Time' || key === "Logout_Time" || key === "IsNotPresent" || key === 'Date' ||key==='FK_emp_id' || key==='total_hours'){
            const cell = document.createElement('td')
           
        
            cell.style.color = data['IsNotPresent']==='Present'?'Green':data["IsNotPresent"]==='Half Day'?'blue':'red'
            cell.textContent = key==='Date'?date_convert(data[key]):key==='Logout_Time'?time_convert(data[key]):key==='Login_Time'?time_convert(data[key]):key==='total_hours'?data['total_hours']:key==='FK_emp_id'?data['FK_emp_id']:key==='IsNotPresent'?data['IsNotPresent']:''
            // cell.textContent = (typeof(data[key]) === 'boolean'?(get_time(timeDifference(data['Login_Time'], data['Logout_Time'])) >= get_time(data['working_hours'])?'P':'A'):key === 'Date'?date_convert(data['Date']): key === 'Logout_Time'? data['Logout_Time'] === data['Login_Time']?'':time_convert(data['Logout_Time']):key==='Login_Time'?time_convert(data[key]):key==='total_hours'?data['total_hours']:key==='login_required'?timeDiff(data['late_time'],data['Login_Time']):data[key])
            //   get_time(timeDifference(data['Login_Time'], data['Logout_Time'])) >= get_time(data['working_hours'])? cell.style.color = 'GREEN':cell.style.color = 'red'
           
        
            row.appendChild(cell)}
        }
        // append the tr in tbody
        tablebody.appendChild(row)
    })
    // append the tbody in table
    table.appendChild(tablebody)
}

// verifying access token when DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {

    if(localStorage.getItem('accessToken')){
     
    // access token verification
    verifyAccessToken();

    }
    else
    {
        // redirect to login page
        window.location.href = '/Templates/Login.html'
    }



    
   // make api for get attendence data
    axios.get(`${base_url}/attendence_data`,{
        headers:
        {
            'Authorization': `Bearer${localStorage.getItem('accessToken')
                                        }`

    }
}).then((response)=>{

        // to display the attendence data in a tabular form
        table_creation(response.data)
        console.log(response.data)
        
    })
})