import swaggerAutogen from 'swagger-autogen'
import path from 'path'
const options = {
	info: {
		title: 'nft api',
		description: 'nft api swagger',
	},
	host: 'localhost:6060',
	schemes: ['http'],
}

const outputFile = './swagger_output.json'
const endpointsFiles = ['./routes/index.ts']

//To build the documentation before the project starts and immediately start it, rewrite the swaggerAutogen(...) function as follows:
swaggerAutogen(options)(outputFile, endpointsFiles, options).then(async () => {
	await import('./app') // Your project's root file
})
