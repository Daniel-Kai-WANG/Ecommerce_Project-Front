import Button from "@/components/Button";
import Center from "@/components/Center";
import Header from "@/components/Header";
import WhiteBox from "@/components/WhiteBox";
import { primary } from "@/lib/colors";
import {signIn, signOut, useSession} from "next-auth/react"
import { RevealWrapper } from "next-reveal";
import styled from "styled-components";
import { useEffect, useState } from "react"
import Input from "@/components/Input"
import axios from "axios";
import Spinner from "@/components/Spinner";
import ProductBox from "@/components/ProductBox";

const ColsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1.2fr .8fr;
    gap: 40px;
    margin: 40px 0;
    p{
        margin: 10px;
    }
`

const CityHolder = styled.div`
    display: flex;
    gap: 5px;
`

const WishedProductsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
`
export default function AccountPage() {
    const { data: session } = useSession()
    const BASE_URL = process.env.NODE_ENV === 'development' ? process.env.DEV_NEXT_PUBLIC_BASE_URL : process.env.PROD_NEXT_PUBLIC_BASE_URL;
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [city, setCity] = useState('')
    const [postalCode, setPostalCode] = useState('')
    const [streetAddress, setStreetAddress] = useState('')
    const [country, setCountry] = useState('')
    const [loaded, setLoaded] = useState(true)
    const [wishedProducts, setWishedProducts] = useState([])

    async function logOut() {
        await signOut({
            callbackUrl: BASE_URL,
        })
    }
    async function login() {
        await signIn('google')
    }

    function saveAddress() {
        const data = {name, email, city, streetAddress, postalCode, country}
        axios.put('/api/address', data)
    }
    useEffect(() => {
        if (!session) {
            return
        }

        setLoaded(false)
        Promise.all([
            axios.get('/api/address'),
            axios.get('/api/wishlist')
        ]).then(([addressResponse, wishlistResponse]) => {
            // Update Address Infomation
            if (addressResponse.data) {
                // Update Address Information
                const { name, email, city, postalCode, streetAddress, country } = addressResponse.data;
                setName(name);
                setEmail(email);
                setCity(city);
                setPostalCode(postalCode);
                setStreetAddress(streetAddress);
                setCountry(country);
            } else {
                setName('');
                setEmail('');
                setCity('');
                setPostalCode('');
                setStreetAddress('');
                setCountry('');
            }
            
            // Update Wishlist Information
            setWishedProducts(wishlistResponse.data.map(wp => wp.product));
    
            // Set Loaded
            setLoaded(true);
        }).catch(error => {
            console.error("Error fetching data: ", error);
            setLoaded(true);
        });
    }, [session])
    function productRemovedFromWishlist(idToRemove) {
        setWishedProducts(prev => [...prev.filter(p => p._id.toString() !== idToRemove)])
    }
    return (
        <>
            <Header />
            <Center>
                <ColsWrapper>
                    <div>
                        <RevealWrapper delay={0}> 
                            <WhiteBox>
                                <h2>Wishlist</h2>
                                {!loaded && (
                                        <Spinner fullWidth={true} />
                                )}
                                {loaded && (
                                    <>
                                        {wishedProducts.length === 0 && (
                                            <>
                                                {session && (
                                                    <p>Your wishlist is empty</p>
                                                )}
                                                {!session && (
                                                    <p>Login to add products to your wishlist</p>
                                                )}
                                            </>
                                        )}        
                                        <WishedProductsGrid>
                                            {wishedProducts.length > 0 && wishedProducts.map(wp => (
                                                <ProductBox key={wp._id} {...wp} wished={true} onRemoveFromWishlist={productRemovedFromWishlist} />
                                            ))}
                                        </WishedProductsGrid>                 
                                    </>
                                      
                                )}                                              
                            </WhiteBox>
                        </RevealWrapper>                                          
                    </div>
                    <div>
                        <RevealWrapper delay={100}> 
                            <WhiteBox>
                                <h2>{session ? 'Account details' : 'Login'}</h2>
                                {!loaded && (
                                    <Spinner fullWidth={true} />
                                )}
                                {loaded && session && (
                                    <>
                                        <Input type="text" 
                                    placeholder="Name" 
                                    value={name} 
                                    name="name"
                                    onChange={e => setName(e.target.value)} />
                                        <Input type="text" 
                                        placeholder="Email" 
                                        value={email} 
                                        name="email"
                                        onChange={e => setEmail(e.target.value)}/>
                                        <CityHolder>
                                            <Input type="text" 
                                            placeholder="City" 
                                            value={city} 
                                            name="city"
                                            onChange={e => setCity(e.target.value)}/>
                                            <Input type="text" 
                                            placeholder="Postal Code" 
                                            value={postalCode} 
                                            name="postalCode"
                                            onChange={e => setPostalCode(e.target.value)}/>
                                        </CityHolder>                        
                                        <Input type="text" 
                                        placeholder="Street Address" 
                                        value={streetAddress} 
                                        name="streetAddress"
                                        onChange={e => setStreetAddress(e.target.value)}/>
                                        <Input type="text" 
                                        placeholder="Country" 
                                        value={country} 
                                        name="country"
                                        onChange={e => setCountry(e.target.value)}/>
                                        <Button black={1} block={1} onClick={saveAddress}>Save</Button>
                                        <hr />
                                    </>
                                )}
                                {session && (
                                <Button 
                                primary={primary}
                                onClick={logOut}
                                >Logout</Button>
                                )}
                                {!session && (
                                    <Button
                                    primary={primary}
                                    onClick={login}
                                    >Login with Google</Button>
                                )}
                            </WhiteBox>
                        </RevealWrapper>
                    </div>
                </ColsWrapper>
            </Center>
        </>
    )
}