/* Title: "Multi Tier Tip Menu" bot
   Author: anxeesh
   Version: 1.0.0 (23Jun2021)
   Based on "tip menu plus 20" by badbadbubba
   Tiered Menu idea from u/Apprehensive_Rise_47
*/

var  HEART 	= '\u2665';	// ♥
    BDIAMOND 	= '\u2666';	// ♦
    BSTAR 	= '\u2605';	// ★

var tip_amt = 0;
var separator_char = "| ";
var MAXITEMS=20;
var menu = [];
var tiers = [];
var current_tier = 0;
var next_tier = 9999999;
var current_total = 0;
var MAXSEP = 9;
separators = [
{label:'Hearts',shortcut:':heart2'},
{label:'Glitter',shortcut:':pixelglitter'},
{label:'Flowers',shortcut:':tinyflower2'},
{label:'Bow',shortcut:':bluebow'},
{label:'Hearts2',shortcut:':pixelheart'},
{label:'Smiley',shortcut:':smile'},
{label:'Text Heart',shortcut:HEART},
{label:'Text Diamond',shortcut:BDIAMOND},
{label:'Text Star',shortcut:BSTAR},
]

cb.settings_choices = [
    {name: 'sepchar', type: 'choice', choice1: 'Vertical Bar', choice2: 'Hearts', choice3:'Glitter',choice4:'Flowers',choice5:'Bow',choice6:'Hearts2',choice7:'Smiley',choice8:'Text Heart', choice9:'Text Diamond', choice10:'Text Star', defaultValue: 'Vertical Bar', label: "Separator character"},
    {name:'starting_tips', type:'int', required: false, defaultValue: 0,
     label: 'current running total (if not zero)'},
    {name:'item1', type:'str', label:'Item 1 (eg 10--flash tits)',},
    {name:'item2', type:'str', required: false, label:'Item 2',},
    {name:'item3', type:'str', required: false, label:'Item 3 (any item can be like \"next 200\", meaning next items are not enabled until tip total reaches 200',},
    {name:'item4', type:'str', required: false, label:'Item 4',},
    {name:'item5', type:'str', required: false, label:'Item 5',},
    {name:'item6', type:'str', required: false, label:'Item 6',},
    {name:'item7', type:'str', required: false, label:'Item 7',},
    {name:'item8', type:'str', required: false, label:'Item 8',},
    {name:'item9', type:'str', required: false, label:'Item 9',},
    {name:'item10', type:'str', required: false, label:'Item 10',},
    {name:'item11', type:'str', required: false, label:'Item 11',},
    {name:'item12', type:'str', required: false, label:'Item 12',},
    {name:'item13', type:'str', required: false, label:'Item 13',},
    {name:'item14', type:'str', required: false, label:'Item 14',},
    {name:'item15', type:'str', required: false, label:'Item 15',},
    {name:'item16', type:'str', required: false, label:'Item 16',},
    {name:'item17', type:'str', required: false, label:'Item 17',},
    {name:'item18', type:'str', required: false, label:'Item 18',},
    {name:'item19', type:'str', required: false, label:'Item 19',},
    {name:'item20', type:'str', required: false, label:'Item 20',},
    {name:'noticecolor', type:'str', label:'Notice color (html code default red #FF0000)', defaultValue: '#FF0000'},
    {name: 'chat_ad', type:'int', minValue: 1, maxValue: 999, defaultValue: 1,
        label: 'Delay in minutes between notice being displayed (minimum 1)'}
];

cb.onTip(function (tip)
{
    tip_amt=parseInt(tip['amount']);
    let tip_message = 'tip amount ' + tip_amt;
    for (var item of menu) {
        if (tip_amt == item.amount) {
	    tip_message = tip['from_user'] + ' tipped for ' + item.item
	    cb.sendNotice(tip_message,'','',cb.settings['noticecolor'],'bold');
        }
    }

    current_total += tip_amt;
    if ((current_total >= next_tier) && (current_tier < (tiers.length - 1))) {
	let barrier = next_tier;
	current_tier += 1;
	menu = tiers[current_tier].menu;
	next_tier = tiers[current_tier].amount;
	cb.sendNotice("Tip menu tier " + (current_tier + 1) + " achieved, next tier is unlocked at total " + next_tier + " tips", '', '', cb.settings['noticecolor'], 'bold');
    }
});

function chatAd() {
    if (menu.length > 0) {
	let message = 'Tip Menu: ' + menu.map(i => i.item + '(' + i.amount + ')').join(separator_char);
        cb.sendNotice(message,'','',cb.settings['noticecolor'],'bold');
	if (current_tier < (tiers.length - 1)) {
            cb.sendNotice('total tips ' + current_total + ' / ' + next_tier,'','',cb.settings['noticecolor'],'bold');
	}
    }	
    cb.setTimeout(chatAd, (cb.settings.chat_ad * 60000));
}
cb.setTimeout(chatAd, (cb.settings.chat_ad * 60000));

function init()
{

     for (i=0;i<=MAXSEP-1;i++) {
          if  (cb.settings['sepchar'] == separators[i].label) {
                separator_char = separators[i].shortcut + ' ';     
          }
     }

    for (i=1;i<=MAXITEMS;i++) {
        var tmp;
        tmp=cb.settings['item' + i];
        if (tmp) {
	    if (tmp.startsWith('next ')) {
		var amt = parseInt(tmp.slice(5));
		if (amt) {
		    tiers.push({amount: amt, menu: menu});
		    menu = [];
		} else {
		    cb.sendNotice('Error- You need a tier starting amount after the \"next\" option, e.g. \"next 100\"', '', '', cb.settings['noticecolor'], 'bold');
		}
	    }
	    else {
		var arr= tmp.split('--');
		if (arr[1]===undefined) {
		    cb.sendNotice('Error-You need two dashes to separate the tip amount and menu item for item no '+ i,'','',cb.settings['noticecolor'],'bold');
		} else {
		    var amt=parseInt(arr[0]);
		    if (amt>0) {
			menu.push({amount: amt, item: arr[1]});
		    }
		}
	    }
	}
    }
    tiers.push({amount: 9999999, menu: menu});

    if (cb.settings.starting_tips) {
	current_total = cb.settings.starting_tips;

	while ((current_tier < (tiers.length - 1)) &&
	       (current_total >= tiers[current_tier].amount))
	    current_tier += 1;
    }
    menu = tiers[current_tier].menu;
    next_tier = tiers[current_tier].amount;
}

init();
