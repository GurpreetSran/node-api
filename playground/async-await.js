const users = [{
    id: 1,
    name: 'Andrew',
    schooldId: 101
},
{
    id: 2,
    name: 'Jesica',
    schooldId: 999
}];
const grades = [{
    id: 1,
    schoolId: 101,
    grade: 86   
},
{
    id: 2,
    schoolId: 999,
    grade: 100
},
{
    id: 3,
    schoolId: 101,
    grade: 80
}];

const getUser = (id) => {
    return new Promise((resolve, reject) => {
        const user = users.find(user => user.id === id);
        
        if (user) {
            return resolve(user);
        }

        reject('User not found');
    });
} 

const getGrades = (schoolId) => {
    return new Promise((resolve, reject) => {
        resolve(grades.filter((grade) => grade.schoolId === schoolId));
    });
}

// const getStatus = (userId) => {
//     let user;
//     return getUser(userId).then((user) => {
//         tempUser = user;
//         return getGrades(user.schooldId).then((grades) => {
//             if (grades.length > 0) {
//                 average = grades.map((grade) => grade.grade).reduce((acc, increment) => acc + increment) / grades.length;
//             }
//             return `${tempUser.name} has ${average}% in class`;
//         });
//     });   
// }

const getStatusAlt = async (userId) => {
    const user = await getUser(userId);
    const grades = await getGrades(user.schooldId)
    let average; 
    if (grades.length > 0) {
        average = grades.map((grade) => grade.grade).reduce((acc, increment) => acc + increment) / grades.length;
    }
    return `${user.name} has ${average}% in class`;
}

getStatusAlt(233).then(status => console.log(status)).catch(e => console.log(e)); 

// getStatus(2).then(status => console.log(status)); 