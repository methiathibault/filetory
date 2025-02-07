import {React ,useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, MapPin } from 'lucide-react';

export default function SubscribePage() {
  const [newMail, setNewMail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [name, setName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [postalAdress, setPostalAdress] = useState(0);
  let navigate = useNavigate();
  
  const go_subscribe =() => {
      navigate("/login")
  }

  const go_strip_club =() => {
    window.open("https://buy.stripe.com/test_5kA5kSdBbdwg1zieUU", '_blank');
  }

  const subscribe = () => {
    axios.post('http://127.0.0.1:3001/users/', {
      email: newMail,
      password: newPassword,
      name: name,
      familyName: familyName,
      postalAdress: postalAdress
    })
    .then(function (response) {
      go_strip_club()
      navigate("/")
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="mt-2 text-gray-600">Sign up for a new account</p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700">
                <User className="w-4 h-4 mr-2" />
                First Name
              </label>
              <input
                type="text"
                onChange={e => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="First name"
              />
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700">
                <User className="w-4 h-4 mr-2" />
                Last Name
              </label>
              <input
                type="text"
                onChange={e => setFamilyName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Last name"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700">
              <MapPin className="w-4 h-4 mr-2" />
              Postal Address
            </label>
            <input
              type="number"
              onChange={e => setPostalAdress(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Postal code"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Mail className="w-4 h-4 mr-2" />
              Email
            </label>
            <input
              type="email"
              onChange={e => setNewMail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Email address"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Lock className="w-4 h-4 mr-2" />
              Password
            </label>
            <input
              type="password"
              onChange={e => setNewPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Password"
            />
            <p className="mt-1 text-sm text-gray-500">
              Password must be at least 12 characters and contain one letter, one number, and one special character
            </p>
          </div>

          <div className="flex justify-between space-x-4">
            <button
              onClick={subscribe}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Register
            </button>
            <button
              onClick={go_subscribe}
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Already have an account?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}