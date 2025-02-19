import TimelineItem, { TimelineDocument } from "../models/Timeline";

type TimelineDay = {
    [key : string] : TimelineDocument[]
}

export const getTimeline = async (req : any, res : any) => {
    try {
        const {companyId} = req.params;
        const timelineItems = await TimelineItem.find({ company : companyId }).sort({ timestamp: -1 }).populate('client user');
        
        const groupedTimeline = timelineItems.reduce((acc, item) => {
          const date = item.timestamp.toISOString().split('T')[0];
          if (!acc[date]) acc[date] = [];
          acc[date].push(item);
          return acc ;
        }, {});
        console.log(groupedTimeline, 'grouped')
        res.json({ success: true, data: groupedTimeline });
      } catch (error : any) {
        res.status(500).json({ success: false, message: error.message });
      }
}

export const addTimelineItem = async (req : any,res : any) => {
    try {
        const { action, actionType, client, user, company, title } = req.body;
      
    
        const newTimelineItem = new TimelineItem({
          user ,
          action,
          actionType,
          client,
          title,
          company
        });

        newTimelineItem.populate('client user')
    
        await newTimelineItem.save();
        res.status(201).json({ success: true, message: "Timeline item created", data: newTimelineItem });
      } catch (error : any) {
        res.status(500).json({ success: false, message: error.message });
      }
}