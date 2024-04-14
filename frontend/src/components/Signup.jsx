import axios from 'axios';
import { useState, useContext} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { AuthContext } from './AuthUtil';
import Navbar from './Navbar';
import forge from 'node-forge';
import { BASE_URL } from '../api/baseApi';
import { v4 as uuidv4 } from 'uuid';
export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const {setUserName, setCert, setPrivateKey, setChatColor} = useContext(AuthContext);
    const options = ["text-fuchsia-500", "text-blue-500", "text-yellow-500", 
    "text-green-500", "text-red-500", "text-indigo-500", "text-purple-500", "text-pink-500",
     "text-teal-500", "text-cyan-500", "text-rose-500", "text-amber-500", "text-emerald-500", 
     "text-lime-500", "text-sky-500", "text-violet-500"]
    const handleSubmit = (e) => {
        e.preventDefault();
        if(username && password) {
            const ca = genCACert();
            // @ts-ignore
            console.log(ca);

            const values = {
                username: username,
                password: password,
                decryptionKey : ca.ca.key
            }
            console.log(forge.pki.certificateFromPem(ca.ca.cert));
            axios.post(`${BASE_URL}/auth/register`, values)
            .then((response) => {
                console.log(response);
                setUserName(username);
                setCert(ca.ca.cert);
                // @ts-ignore
                setPrivateKey(ca.ca.key);
                setChatColor(options[Math.floor(Math.random() * options.length)]);
                navigate(`/home`);
                })
            .catch(function (error) {
                // handle error
                console.log(error);
                alert(error.response.data.message)
            }); 
        }
    }
    return (
        <>
        <Navbar/>
       
        <div className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Sign Up to create your account
                    </h1>
                    <form>
                        <div>
                            <label htmlFor="inputUsername" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" >Username</label>
                            <input 
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"  
                            id="inputUsername" 
                            name="username" 
                            placeholder="Enter Username"
                            onChange={(e) => setUsername(e.target.value)}
                            ></input>
                        </div>
                        <div >
                            <label htmlFor="inputPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input 
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            id="inputPassword" 
                             name="password" 
                             type="password"
                             placeholder="Enter Password"
                             onChange={(e) => setPassword(e.target.value)}
                            ></input>
                        </div>
                        <button onClick={(e) => handleSubmit(e)} id="submit-button" type="submit" 
                                className="mt-4 w-full text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 
                                focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium 
                                rounded-lg text-sm px-5 py-2.5 text-center transition duration-150 ease-in-out">
                            Register
                        </button>
                       </form>
                    
                        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                            Already have an account?  <Link to="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign In</Link>
                        </p>
                    
                </div>
            </div>
        </div>
        </div>
        </>
    )
}


export function genCACert(options = {}) {
    options = {...{
        commonName: 'Testing CA - DO NOT TRUST',
        bits: 2048
    }, ...options}
    
    // let keyPair = await new Promise((res, rej) => {
    //     forge.pki.rsa.generateKeyPair({ bits: options.bits }, (error, pair) => {
    //         if (error) rej(error);
    //         else res(pair)
    //     })
    // })
    let keyPair = forge.pki.rsa.generateKeyPair({ bits: options.bits })
    
    let cert = forge.pki.createCertificate()
    cert.publicKey = keyPair.publicKey
    cert.serialNumber = '01';
    cert.validity.notBefore = new Date()
    cert.validity.notBefore.setDate(cert.validity.notBefore.getDate() - 1)
    cert.validity.notAfter = new Date()
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1)
    
    cert.setSubject([{name: 'commonName', value: options.commonName}])
    cert.setExtensions([{ name: 'basicConstraints', cA: true }])
    
    cert.setIssuer(cert.subject.attributes)
    cert.sign(keyPair.privateKey, forge.md.sha256.create())
    
    return {
        ca: {
            key: forge.pki.privateKeyToPem(keyPair.privateKey),
            cert: forge.pki.certificateToPem(cert)
        }
    }
}