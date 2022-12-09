import type { NextApiRequest, NextApiResponse } from 'next'
import { ConnectToDB } from '../../backend/db/Database';
import { UserModel } from "../../backend/db/schemas/User";
let md5 = require("blueimp-md5");

type Data = {
  success: any
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	if (req.method === 'POST') {
		res.status(200);
		// console.log(req.body.params.email);

		ConnectToDB();

		UserModel.findOne({
			email: req.body.params.email
		}, function (err, specified_user) {
			if (err) {
				console.log("error logging in");
			} else {
				let expected_pass = specified_user?.password;
				let hashed_pass = md5(req.body.params.pass);
				// console.log(hashed_pass);
				if (hashed_pass === expected_pass) {
					// console.log('good');
					// respond to the user in a way that validates the login
					res.json({
						success: 1
					})
				} else {
					// console.log('bad');
					// respond that the username or password is wrong
					res.json({
						success: 0
					})
				}
			}
		});
	}
}