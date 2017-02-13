import test from 'ava';
import {get} from '../client/react/api/api'
import sinon from 'sinon'
import fetchMock from 'fetch-mock';



// myModule.onlyCallDomain2()
// 	.then(() => {
// 		expect(fetchMock.called('http://domain2')).to.be.true;
// 		expect(fetchMock.called('http://domain1')).to.be.false;
// 		expect(fetchMock.calls().unmatched.length).to.equal(0);
// 		expect(JSON.parse(fetchMock.lastUrl('http://domain2'))).to.equal('http://domain2/endpoint');
// 		expect(JSON.parse(fetchMock.lastOptions('http://domain2').body)).to.deep.equal({prop: 'val'});
// 	})
// 	.then(fetchMock.restore)

test.beforeEach(() => {
  fetchMock.get('https://maidavale.org', {
    affectedRecords: 1
  });
});

test('Array', t => {
  const posts = get("https://maidavale.org").then(() => {
    t.true(fetchMock.called('https://maidavale.org'));
  })
  .then(fetchMock.restore);
});
