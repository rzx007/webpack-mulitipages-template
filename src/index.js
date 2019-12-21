import './style/index.css';
import './style/leo.scss';
import $ from'jquery';

function createElement() {
  var greet = document.createElement('div');
  greet.textContent = "Hi there and greetings!";
  greet.className = 'box';
  
  return greet;
};
document.body.appendChild(createElement());
$('.box').height(100);