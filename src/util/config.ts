export function getEnvOrDefault(keyName: string, envVal: string | undefined = undefined, defaultValue: string = ''):string {
  const envValue = process.env[keyName] || envVal;
  console.info(`Searching for ${keyName}`)
  if (envValue === undefined && envValue !== ''){
    console.debug(`${keyName} is undefined: using `, defaultValue)
    return defaultValue;
  }
  console.debug(`Env ${keyName} = ${envValue}`)
  return envValue;
}

export async function getStaticProps() {
  console.log(process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
  console.log(process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID);
  console.log(process.env.NEXT_PUBLIC_APP_ID);
  console.log(process.env.NEXT_PUBLIC_MEASUREMENT_ID);
}
export const envVars = {
  baseURL: '/FoodPlanerReact',
  apiKey: getEnvOrDefault("NEXT_PUBLIC_FIREBASE_API_KEY", process.env.NEXT_PUBLIC_FIREBASE_API_KEY, "apiKey"),
  messagingSenderId: getEnvOrDefault("NEXT_PUBLIC_MESSAGING_SENDER_ID", process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID, "senderId"),
  appId: getEnvOrDefault("NEXT_PUBLIC_APP_ID", process.env.NEXT_PUBLIC_APP_ID, "appId"),
  measurementId: getEnvOrDefault("NEXT_PUBLIC_MEASUREMENT_ID", process.env.NEXT_PUBLIC_MEASUREMENT_ID, "measurementId"),
}