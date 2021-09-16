import React from "react";
import axios from 'axios'

class About extends React.Component{

  state = {
    name: ''
  }

  handleChange = e => {
    this.setState({name: e.target.value})
  }

  handleSubmit = e => {
    e.preventDefault()
    const user = {
      name: this.state.name
    }
    axios.post(`https://jsonplaceholder.typicode.com/users`, { user })
    .then(res => {
      console.log(res);
      console.log(res.data);
    })
  }
  

  render(){
    // return <h1>Hello, this is gotasks app</h1>
    return(
      <form onSubmit={this.handleSubmit}>
        <label>
          Person Name:
          <input type='text' name='name' onChange={this.handleChange}/>
          <button type="submit">Add</button>
        </label>
      </form>
    )
  }
}

export default About;