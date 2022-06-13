import http from 'k6/http';
import { check, group, sleep } from 'k6';

const options = {
  vus: 1000,
  duration: '30s',
};
const SLEEP_DURATION = 0.1;

export default function () {
  group('test all api requests', (_) => {
    const getQ = http.get(`http://localhost:3000/qa/questions`,JSON.stringify({params: {product_id: '1000010'}}));
    check(getQ, {
      'getAllQ res is status 200' : (r) => r.status === 200,
    })

    const getA = http.get(`http://localhost:3000/qa/questions/2/answers`);
    check(getA, {
      'getAllA res is status 200' : (r) => r.status === 200,
    })

    const postQ = http.post(`http://localhost:3000/qa/questions`, JSON.stringify({product_id: '1000010', body:'test', name:'test', email:'test'}), {headers : {'Content-Type': 'application/json'}});
    check(postQ, {
      'postQ res is status 201' : (r) => r.status === 201,
    })

    const postA = http.post(`http://localhost:3000/qa/questions/2/answers`, JSON.stringify({body:'test', name:'test', email:'test', photos:'[]'}),{headers : {'Content-Type': 'application/json'}} );
    check(postA, {
      'postA res is status 201' : (r) => r.status === 201,
    })

    const helpfulA = http.put(`http://localhost:3000/qa/answers/6879315/helpful`);
    check(helpfulA, {
      'helpfulA res is status 204' : (r) => r.status === 204,
    })

    const helpfulQ = http.put(`http://localhost:3000/qa/questions/3518966/helpful`);
    check(helpfulQ, {
      'helpfulQ res is status 204' : (r) => r.status === 204,
    })

  })

  // http.put(`http://localhost:3000/qa/questions/3518966/report`);

}

