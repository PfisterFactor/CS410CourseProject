import type { NextApiRequest, NextApiResponse } from 'next'

type ErrorResp = {
    error: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any | ErrorResp>
) {
    const loginToken = req.query["loginToken"];
    if (false/*loginToken == null*/) {
        res.status(400).json({error: "Invalid login token"});
        return
    }
    const mirroredURL = req.query["mirror"] ?? null;
    if (mirroredURL == null) {
        res.status(400).json({error: "Must specify mirrored url"});
        return;
    }
    try {
        new URL(mirroredURL as string)
    }
    catch(e) {
        res.status(400).json({error: "Invalid mirror url"});
        return;
    }
    const mirror = await fetch(<string>mirroredURL);
    res.status(mirror.status).send(await mirror.text());
}
